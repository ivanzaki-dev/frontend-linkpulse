import type { StepState } from '@/components/ui';

/** Maps order + payment status to visual stepper states (display only). */
export function orderProgressSteps(
  status: string,
  paymentStatus: string
): { label: string; state: StepState }[] {
  const paid = paymentStatus === 'paid';
  const completed = status === 'completed';
  const processing = status === 'processing';

  let payment: StepState = 'pending';
  if (paid || completed) payment = 'done';
  else if (status === 'awaiting_payment' || paymentStatus === 'pending' || paymentStatus === 'awaiting_payment') {
    payment = 'active';
  }

  let check: StepState = 'pending';
  if (completed) check = 'done';
  else if (processing || (paid && !completed)) check = 'active';

  let report: StepState = 'pending';
  if (completed) report = 'done';

  return [
    { label: 'Pembayaran', state: payment },
    { label: 'Pengecekan', state: check },
    { label: 'Laporan', state: report },
  ];
}
