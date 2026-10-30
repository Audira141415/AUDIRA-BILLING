import { Controller, Get, Post, Body, Query, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { SpeedtestService, SpeedtestBenchmarkPayload } from './speedtest.service';

@Controller('speedtest')
export class SpeedtestController {
  constructor(private readonly speedtestService: SpeedtestService) {}

  @Get('servers')
  getServers() {
    return {
      success: true,
      servers: this.speedtestService.getServerNodes(),
    };
  }

  @Get('server-info')
  getServerInfo() {
    return {
      success: true,
      server: this.speedtestService.getServerInfo(),
    };
  }

  @Get('ping')
  async getPing(@Query('node') node?: string) {
    const servers = this.speedtestService.getServerNodes();
    const target = servers.find((s) => s.id === node) || servers[0];

    // If target node is a remote node, introduce calibrated network round-trip transit delay
    if (target.id !== 'audira-core-01' && target.id !== 'audira-cpe-gateway') {
      const transitDelay = Math.max(1, Math.round(target.basePingMs));
      await new Promise((r) => setTimeout(r, transitDelay));
    }

    return {
      success: true,
      timestamp: Date.now(),
      server: target.name,
      nodeId: target.id,
      tier: target.tier,
      basePingMs: target.basePingMs,
    };
  }

  @Get('download')
  async getDownloadChunk(
    @Res() res: Response,
    @Query('bytes') bytesQuery?: string,
    @Query('node') node?: string,
  ) {
    const size = Math.min(25000000, Math.max(100000, parseInt(bytesQuery || '8000000', 10) || 8000000));
    const servers = this.speedtestService.getServerNodes();
    const target = servers.find((s) => s.id === node) || servers[0];

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', size.toString());
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Server-Node', target.id);

    // Stream real bytes in socket chunks
    const chunkSize = 64 * 1024; // 64 KB per socket buffer
    const buf = Buffer.alloc(chunkSize, 0x41); // 'A'
    let sent = 0;

    while (sent < size) {
      const remaining = size - sent;
      const currentChunkSize = Math.min(chunkSize, remaining);
      if (currentChunkSize === chunkSize) {
        res.write(buf);
      } else {
        res.write(Buffer.alloc(currentChunkSize, 0x41));
      }
      sent += currentChunkSize;

      // Ensure event loop processes chunk immediately for accurate network measurement
      if (sent % (512 * 1024) === 0) {
        await new Promise((r) => setImmediate(r));
      }
    }
    res.end();
  }

  @Post('upload')
  async handleUpload(@Req() req: Request, @Query('node') node?: string) {
    let receivedBytes = 0;
    const start = Date.now();

    for await (const chunk of req) {
      receivedBytes += (chunk as Buffer).length;
    }

    const durationSec = (Date.now() - start) / 1000;
    const mbps = durationSec > 0 ? (receivedBytes * 8) / (durationSec * 1000000) : 0;

    return {
      success: true,
      receivedBytes,
      durationSec: parseFloat(durationSec.toFixed(3)),
      throughputMbps: parseFloat(mbps.toFixed(2)),
      node: node || 'audira-core-01',
      timestamp: Date.now(),
    };
  }

  @Get('history')
  getHistory() {
    return {
      success: true,
      history: this.speedtestService.getHistory(),
    };
  }

  @Post('run')
  async runBenchmark(
    @Body()
    body: SpeedtestBenchmarkPayload,
  ) {
    return this.speedtestService.runBenchmark(body);
  }
}
