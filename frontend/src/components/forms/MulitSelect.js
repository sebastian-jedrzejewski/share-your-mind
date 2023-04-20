import Select from "react-select";
import useFetchData from "../../hooks/useFetchData";

const MultiSelect = ({ selectedCategories, setSelectedCategories }) => {
  const { data, isLoading } = useFetchData("/api/v1/categories");

  const categories = [];
  if (isLoading) {
    return null;
  } else {
    let name;
    data.map((category) => {
      name = category?.name.charAt(0).toUpperCase() + category?.name.slice(1);
      return categories.push({ value: name, label: name, id: category?.id });
    });
  }

  const handleChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  return (
    <Select
      isMulti
      name="categories"
      options={categories}
      className="basic-multi-select"
      classNamePrefix="select"
      value={selectedCategories}
      onChange={handleChange}
      placeholder={<div>Select categories</div>}
    />
  );
};

export default MultiSelect;
