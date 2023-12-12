import { type ChangeEvent } from "react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";

interface Props {
  count: number;
  limit: number;
  onLimitChange: (limit: number) => void;
  offset: number;
  onOffsetChange: (offset: number) => void;
}

export function Pagination ({
  count,
  limit,
  onLimitChange,
  offset,
  onOffsetChange
}: Props) {
  const handleLimitChange = (value: string) => {
    onLimitChange(parseInt(value))
  }

  const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
    onOffsetChange(parseInt(e.target.value) - 1)
  }

  return (
    <div className="flex flex-col space-y-2 items-center gap-4">
      <Label className="flex items-center gap-2">
        Mostrar
        <Select value={limit.toString()} onValueChange={handleLimitChange}>
          <SelectTrigger>
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        productos
      </Label>
      <Label className="flex items-center gap-2">
        Página
        <Input type="number" min={0} max={Math.ceil(count / limit)} value={offset + 1} onChange={handleOffsetChange} />
      </Label>
      <div>
        <span className="font-semibold">{offset * limit + 1}</span>
        <span> - </span>
        <span className="font-semibold">{offset * limit + limit}</span>
        <span> de </span>
        <span className="font-semibold">{Math.ceil(count / limit)}</span>
      </div>
    </div>
  )
}