import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SanitizeInputMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Sanitize body
    if (req.body) {
      req.body = this.sanitize(req.body);
    }

    // Sanitize query params
    if (req.query) {
      req.query = this.sanitize(req.query);
    }

    // Sanitize params
    if (req.params) {
      req.params = this.sanitize(req.params);
    }

    next();
  }

  private sanitize(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      if (typeof obj === 'string') {
        // Remove null bytes
        obj = obj.replace(/\x00/g, '');
        // Remove control characters except newline and tab
        obj = obj.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    }

    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = this.sanitize(obj[key]);
      }
    }
    return sanitized;
  }
}
