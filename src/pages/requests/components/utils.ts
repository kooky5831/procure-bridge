
export function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
      return "bg-green-500/10 text-green-500";
    case "Rejected":
      return "bg-red-500/10 text-red-500";
    case "Pending":
      return "bg-yellow-500/10 text-yellow-500";
    case "In Approval":
      return "bg-yellow-500/10 text-yellow-500";
    case "Not Started":
      return "bg-gray-500/10 text-gray-500";
    case "Draft":
      return "bg-gray-500/10 text-gray-500";
    default:
      return "bg-blue-500/10 text-blue-500";
  }
}
