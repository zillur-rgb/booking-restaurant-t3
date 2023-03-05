import ReactCalenadar from "react-calendar";

const index = ({}) => {
  return (
    <div>
      <ReactCalenadar
        minDate={new Date()}
        className="REACT_CALENDAR p-2"
        view="month"
        locale="EN-US"
        onClickDay={(day) => console.log("Selected day: ", day)}
      />
    </div>
  );
};

export default index;
