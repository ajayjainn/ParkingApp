import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetUserBookingsQuery } from "../bookingApiSlice"


export function PastBookings() {
  
  const {data,isSuccess} = useGetUserBookingsQuery()

  console.log()

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead className="text-center">From</TableHead>
          <TableHead className="text-center">To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((pB) => (
          <TableRow key={pB.id}>
            <TableCell className="font-medium">{pB.from}</TableCell>
            <TableCell>{pB.from}</TableCell>
            <TableCell>{pB.to}</TableCell>
            <TableCell className="text-right">{pB.bookingPrice}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}



export default PastBookings 