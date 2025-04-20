export interface ReceiptFilterDto {
  userId: number;
  merchants?: string;
  categories?: string;
  startDate?: string;
  endDate?: string;
  paymentTypes?: string;
  totalFrom?: string;
  totalTo?: string;
}
