import { DealStatus } from '@windingtree/sdk-types';

// enum DealStatus {
//   Created = 0,// Just created
//   Claimed = 1,// Claimed by the supplier
//   Rejected = 2,// Rejected by the supplier
//   Refunded = 3,// Refunded by the supplier
//   Cancelled = 4,// Cancelled by the buyer
//   CheckedIn = 5,// Checked In
//   CheckedOut = 6,// Checked Out
//   Disputed = 7
// }

export const getDealStatusColor = (status: DealStatus): string => {
  let color = 'green';

  switch (status) {
    case 0:
      color = 'orange';
      break;
    case 1:
      color = 'magenta';
      break;
    case 2:
    case 3:
    case 4:
    case 7:
      color = 'red';
      break;
    case 5:
    case 6:
      color = 'green';
      break;
    default:
  }

  return color;
};
