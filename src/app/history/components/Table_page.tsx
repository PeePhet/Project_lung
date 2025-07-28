import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Table_page({ symtoms }: { symtoms: any[] }) {
  return (
    <Table>
      <TableCaption>Symptom History</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Date</TableHead>
          <TableHead>Symptom</TableHead>
          <TableHead>Analysis Result</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {symtoms.map((value : any, index : any) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {new Date(value.date).toLocaleString()}
            </TableCell>
            <TableCell>{value.symptom}</TableCell>
            <TableCell>{value.result}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
