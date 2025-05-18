import Select from "@/components/Select";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe(Select, () => {
  it('should render with correct label', () => {
    const onChange = jest.fn();
    const options = [
      { key: "1", value: "AMS", label: "Amsterdam" },
      { key: "2", value: "RTM", label: "Rotterdam" },
    ];

    render(
      <Select
        id="origin"
        name="origin"
        label="Origin"
        value=""
        options={options}
        onChange={onChange}
      />
    );

    const label = screen.getByLabelText(/origin/i);
    expect(label).toBeInTheDocument();
  });
});

it('should call onChange when an option is selected', () => {
  const onChange = jest.fn();
  const options = [
    { key: "1", value: "AMS", label: "Amsterdam" },
    { key: "2", value: "RTM", label: "Rotterdam" },
  ];

  render(
    <Select
      id="origin"
      name="origin"
      label="Origin"
      value=""
      options={options}
      onChange={onChange}
    />
  );

  const select = screen.getByLabelText(/origin/i);
  fireEvent.change(select, { target: { value: "AMS" } });

  expect(onChange).toHaveBeenCalled();
});