import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { User } from "@/store/user-store";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  setForm: React.Dispatch<React.SetStateAction<User>>;
};

export default function AddressDialog({ open, setOpen, setForm }: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastQueryRef = useRef("");

  const handleSearch = (value: string) => {
    setSearch(value);
    lastQueryRef.current = value;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const query = value;
      console.log(process.env.NEXT_PUBLIC_RAJAONGKIR_KEY);

      try {
        const res = await fetch(`/api/address?search=${query}`);

        if (!res.ok) return;

        const json = await res.json();

        if (lastQueryRef.current === query) {
          setResults(json.data || []);
        }
      } catch (err) {
        console.error("Address search failed", err);
      }
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Search Address</DialogTitle>
        </DialogHeader>

        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Type city / district..."
        />

        <div className="mt-3 space-y-2">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  address: {
                    id: item.id,
                    label: item.label,
                    province_name: item.province_name,
                    city_name: item.city_name,
                    district_name: item.district_name,
                    subdistrict_name: item.subdistrict_name,
                    zip_code: item.zip_code,
                  },
                }));

                setOpen(false);
              }}
              className="p-2 rounded-md hover:bg-muted cursor-pointer"
            >
              {item.label}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
