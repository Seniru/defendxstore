import Button from "../components/Button"
import Input from "../components/Input"
import SearchBar from "../components/SearchBar"
import Select from "../components/Select"
import Table from "../components/Table"

export default function Components() {
  return (
    <div className="content">
      <h1>Components</h1>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <p>Primary text</p>
      <p className="secondary-text">Secondary text</p>
      <SearchBar />
      <br />
      <Select items={["Item 1", "Item 2", "Item 3", "Item 4"]} />
      <br />
      <Input type="text" placeholder="Text input" />
      <Input type="number" placeholder="Numeric input" />
      <br />
      <Button kind="primary">Primary button</Button>
      <Button kind="secondary">Secondary button</Button>
      <Button kind="danger">Danger button</Button>
      <Button kind="danger-secondary">Danger secondary button</Button>
      <br />
      <br />
      <div className="container">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, ipsa!
        Quasi assumenda fugiat error ducimus dicta modi consequatur aut corrupti
        iure quo dolorem, amet, impedit unde. Voluptatem illum quidem unde.
      </div>
      <h3>Table</h3>
      <Table
        headers={["Heading 1", "Heading 2", "Heading 3", "Heading 4"]}
        rows={[
          ["Data 1", "Data 2", "Data 3", "Data 4"],
          ["Data 1", "Data 2", "Data 3", "Data 4"],
          ["Data 1", "Data 2", "Data 3", "Data 4"],
          ["Data 1", "Data 2", "Data 3", "Data 4"],
        ]}
      />
    </div>
  )
}
