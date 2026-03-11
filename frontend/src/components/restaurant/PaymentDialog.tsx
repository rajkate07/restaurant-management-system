import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, CreditCard, QrCode, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/types/restaurant';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: 'cash' | 'online', transactionId?: string) => void;
  total: number;
}

const PaymentDialog = ({ open, onClose, onSelect, total }: PaymentDialogProps) => {
  const [method, setMethod] = useState<'selection' | 'cash' | 'online'>('selection');
  const [transactionId, setTransactionId] = useState('');

  const handleClose = () => {
    setMethod('selection');
    setTransactionId('');
    onClose();
  };

  const handleOnSelect = (m: 'cash' | 'online') => {
    if (m === 'cash') {
      onSelect('cash');
      handleClose();
    } else {
      setMethod('online');
    }
  };

  const handleOnlineConfirm = () => {
    onSelect('online', transactionId);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {method === 'online' ? 'Online Payment' : 'Select Payment Method'}
          </DialogTitle>
          <p className="text-center text-2xl font-bold text-primary">{formatCurrency(total)}</p>
        </DialogHeader>

        {method === 'selection' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              variant="outline"
              className="h-32 flex-col gap-3 text-base hover:border-success/50 hover:bg-success/5 border-2 transition-all"
              onClick={() => handleOnSelect('cash')}
            >
              <Banknote className="h-10 w-10 text-success" />
              <span className="font-bold">Cash</span>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex-col gap-3 text-base hover:border-primary/50 hover:bg-primary/5 border-2 transition-all"
              onClick={() => handleOnSelect('online')}
            >
              <CreditCard className="h-10 w-10 text-primary" />
              <span className="font-bold">Online</span>
            </Button>
          </div>
        )}

        {method === 'online' && (
          <div className="space-y-6 mt-2">
            <div className="flex flex-col items-center gap-4 p-4 bg-muted/30 rounded-xl border-2 border-dashed border-muted">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <img
                  src="/qr-code.jpg"
                  alt="UPI QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Scan to Pay</p>
                <p className="font-bold text-lg">tanisharestaurant@upi</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="transactionId" className="text-sm font-semibold">Transaction ID / Reference Number</Label>
              <div className="relative">
                <Input
                  id="transactionId"
                  placeholder="Enter 12 digit transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="h-12 border-2 focus:border-primary pr-10"
                />
                {transactionId.length >= 8 && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                * Note: Transaction ID is required for online payments
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 gap-2"
                onClick={() => setMethod('selection')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1 h-12 gap-2"
                disabled={!transactionId.trim()}
                onClick={handleOnlineConfirm}
              >
                <QrCode className="h-4 w-4" />
                Confirm & Bill
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
