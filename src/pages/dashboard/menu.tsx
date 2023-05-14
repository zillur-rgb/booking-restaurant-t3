import dynamic from "next/dynamic";
import { useState } from "react";
import { MultiValue } from "react-select/dist/declarations/src";
import { selectOptions } from "~/utils/helpers";
interface MenuProps {
  name: string;
  price: number;
  categories: MultiValue<{ value: string; label: string }>;
  file: undefined | File;
}

// When we import Select from react-select we will get a hydration error in Nextjs
// I found this solution to get rid of hydration error
// As I am using Nextjs 12, I can use a component client side like this
const DynamicSelect = dynamic(() => import("react-select"), { ssr: false });
const menu = () => {
  const [input, setInput] = useState<MenuProps>({
    name: "",
    price: 0,
    categories: [],
    file: undefined,
  });
  return (
    <>
      <div>
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <input
            name="name"
            className="h-12 rounded-sm border-none bg-gray-200"
            type="text"
            placeholder="name"
            onChange={({ target }) =>
              setInput((prev) => ({ ...prev, name: target.value }))
            }
            value={input.name}
          />
          <input
            name="price"
            className="h-12 rounded-sm border-none bg-gray-200"
            type="number"
            placeholder="price"
            onChange={({ target }) =>
              setInput((prev) => ({ ...prev, price: Number(target.value) }))
            }
            value={input.price}
          />

          <DynamicSelect
            value={input.categories}
            onChange={(e: any) =>
              setInput((prev) => ({ ...prev, categories: e }))
            }
            isMulti
            className="h-12"
            options={selectOptions}
          />
        </div>
      </div>
    </>
  );
};

export default menu;
