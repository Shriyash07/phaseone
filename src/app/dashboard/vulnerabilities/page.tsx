import { vulnerabilities } from "@/lib/data";
import { columns } from "@/components/vulnerabilities/columns";
import { DataTable } from "@/components/vulnerabilities/data-table";

export default function VulnerabilitiesPage() {
    return (
        <div className="container mx-auto py-2">
            <h1 className="text-2xl font-bold mb-4 font-headline">Vulnerabilities</h1>
            <DataTable columns={columns} data={vulnerabilities} />
        </div>
    )
}
