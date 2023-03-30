import Select from "react-select";
import useFetchData from "../../hooks/useFetchData";

const MultiSelect = () => {
  const { data, isLoading } = useFetchData("/api/v1/categories");

  const categories = [];
  if (isLoading) {
    return null;
  } else {
    let name;
    data.map((category) => {
      name = category?.name.charAt(0).toUpperCase() + category?.name.slice(1);
      categories.push({ value: name, label: name });
    });
    console.log(categories);
  }

  return (
    <Select
      isMulti
      name="categories"
      options={categories}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

export default MultiSelect;
