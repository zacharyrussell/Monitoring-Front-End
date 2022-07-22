import React, { useState } from "react";
import Papa from "papaparse";
import Table from "./components/table";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const App = () => {

  // This state will store the parsed data
  const [data, setData] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const [tableData, setTableData] = useState([
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "" },
  ]);
  const [curTableData, setCurTableData] = useState([
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "" },
  ]);

  var parsedData = [
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "" },
  ];
  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };
  const handleParse = () => {

    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      parsedData = csv?.data;
      setTableData(parsedData)
      const columns = Object.keys(parsedData[0]);
      isInDateRange("2022-05-13")
      //console.log(columns)
      //setData(columns);
    };
    reader.readAsText(file);
  };
  function isInDateRange(date) {
    var curDate = new Date(date)
    var start = new Date(startDate)
    var end = new Date(endDate)
    return curDate >= start && curDate <= end;
  }

  const updateTableContent = () => {
    console.log(parsedData)
    var newTableData = []
    for (let i = 0; i < tableData.length; i++) {
      if (isInDateRange(tableData[i])) {
        newTableData.push(tableData[i])
      }
    }
    setCurTableData(newTableData)
  }

  const updateStartDate = event => {
    setStartDate(event.target.value)
    console.log(event.target.value)
  }
  const updateEndDate = event => {
    setEndDate(event.target.value)
    console.log(event.target.value)
  }

  function Table() {
    return (
      <div className="App">
        <table>
          <tr>
            <th>Date</th>
            <th>Location</th>
            <th>Meeting</th>
            <th>Doc Title</th>
            <th>PDF</th>
            <th>Video</th>
            <th>Video Link</th>
          </tr>
          {tableData.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.Date}</td>
                <td>{val.Location}</td>
                <td>{val.Meeting}</td>
                <td>{val.DocTitle}</td>
                <td>{val.PDF}</td>
                <td>{val.Video}</td>
                <td>{val.Link}</td>
              </tr>
            )
          })}
        </table>
      </div>
    );
  }

  return (
    <>
      <div>
        <label htmlFor="csvInput" style={{ display: "block" }}>
          Enter CSV File
        </label>
        <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
        />
        <div>
          <button onClick={handleParse}>Parse</button>
        </div>
        <div style={{ marginTop: "3rem" }}>
          {error ? error : data.map((col,
            idx) => <div key={idx}>{col}</div>)}
        </div>
      </div>
      <input type="date" onChange={updateStartDate} value={startDate}></input>
      <input type="date" onChange={updateEndDate} value={endDate}></input>
      <button onClick={updateTableContent}>Refresh</button>
      <Table data={parsedData} />
    </>
  );
};



export default App;
