import { ShieldCheck, ShieldAlert, Droplets, Clock } from 'lucide-react';

export function BadgeVerified({ confirmed }) {
  return confirmed ? (
    <span className="badge-green">
      <ShieldCheck className="w-3 h-3" />
      Verified Safe
    </span>
  ) : (
    <span className="badge-gray">
      <ShieldAlert className="w-3 h-3" />
      Unverified
    </span>
  );
}

export function BadgeOpen({ isOpen }) {
  return isOpen ? (
    <span className="badge-green">
      <span className="status-dot open" />
      Open
    </span>
  ) : (
    <span className="badge-gray">
      <span className="status-dot closed" />
      Closed
    </span>
  );
}

export function BadgeFree({ isFree }) {
  return isFree ? (
    <span className="badge-blue">
      <Droplets className="w-3 h-3" />
      Free
    </span>
  ) : (
    <span className="badge-yellow">
      <Droplets className="w-3 h-3" />
      Paid
    </span>
  );
}


export function HoursBadge({ hours }) {
  return (
    <span className="badge-gray">
      <Clock className="w-3 h-3" />
      {hours}
    </span>
  );
}

export function ConfirmationCount({ count }) {
  return (
    <span className="badge-green">
      {count} confirmed
    </span>
  );
}
