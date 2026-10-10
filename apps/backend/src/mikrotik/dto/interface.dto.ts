export interface PortInterface {
  id: string;
  name: string;
  type: 'sfp' | 'ethernet' | 'combo';
  status: 'up' | 'down' | 'disabled';
  speed: string;
  description?: string;
  rxBytes: string;
  txBytes: string;
  rxPackets?: string;
  txPackets?: string;
  macAddress?: string;
  mtu?: number;
}

export interface InterfaceStats {
  name: string;
  rxBytes: number;
  txBytes: number;
  rxPackets: number;
  txPackets: number;
  rxDrops?: number;
  txDrops?: number;
  rxErrors?: number;
  txErrors?: number;
}
