import Select from "react-select";

const categories = [
  { value: "movies", label: "Movies" },
  { value: "football", label: "Football" },
  { value: "sports", label: "Sports" },
];

const MultiSelect = () => {
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
