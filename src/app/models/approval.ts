export interface DocumentApproval {
  userName: string;
  state: number;
  resolution: string;
  comment: string;
}

export enum ApprovedState {
  APPROVED = 'approved',
  DISAPPROVED = 'disapproved'
}

export const TextApprovedState: Map<ApprovedState, string> = new Map([
  [ApprovedState.APPROVED, 'Документ успешно утвержден'],
  [ApprovedState.DISAPPROVED, 'Документ не утвержден'],
]);
