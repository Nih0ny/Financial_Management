export interface ReceiptFilterDto {
  merchants?: string;
  categories?: string;
  startDate?: string;
  endDate?: string;
  paymentTypes?: string;
  totalFrom?: string;
  totalTo?: string;
}
