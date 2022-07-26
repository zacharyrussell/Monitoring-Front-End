import React, { useState } from "react";
import Papa from "papaparse";
import Table from "./components/table";
import "./App.css"
import { useEffect } from "react";
// import { doSearch } from "./SearchPDF"
// import tika from "node-tika"


// Allowed extensions for input file
const allowedExtensions = ["csv"];

const App = () => {

  // This state will store the parsed data
  const [data, setData] = useState([]);

  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate, setEndDate] = useState('2022-07-06');
  const [searchText, setSearchText] = useState('');


  const [tableData, setTableData] = useState([
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "", Keywords: "" },
  ]);
  const [curTableData, setCurTableData] = useState([
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "", Keywords: "" },
  ]);
  const [curSearchTableData, setCurSearchTableData] = useState([
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "", Keywords: "" },
  ]);



  var parsedData = [
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "", Keywords: "" },
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
      setCurTableData(parsedData)
      setCurSearchTableData(parsedData)
      const columns = Object.keys(parsedData[0]);
      console.log(parsedData[1])
      // var options = {

      //   // Hint the content-type. This is optional but would help Tika choose a parser in some cases.
      //   contentType: 'application/pdf'
      // };
      // var PDF_URL = 'https://www.austintexas.gov/edims/document.cfm?id=383785';
      // tika.text(PDF_URL, function (err, text) {
      //   console.log(text)
      // });
      // pdfparse(pdffile).then(function(data){
      //   console.log(data.numpages)
      // })
      //console.log(columns)
      //setData(columns);
    };
    reader.readAsText(file);
  };
  function isInDateRange(date) {
    var formatDate = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6)
    var curDate = new Date(formatDate)
    var start = new Date(startDate)
    var end = new Date(endDate)
    return curDate >= start && curDate <= end;
  }

  const updateTableContent = () => {
    var newTableData = []
    for (let i = 0; i < curSearchTableData.length; i++) {
      if (isInDateRange(curSearchTableData[i].Date)) {
        newTableData.push(curSearchTableData[i])
      }
    }
    setCurTableData(newTableData)
  }

  const updateStartDate = event => {
    setStartDate(event.target.value)
  }

  function containsWord(keywords) {
    return keywords.includes(searchText)
  }

  const updateTableResults = () => {
    var newTableData = []
    for (let i = 0; i < tableData.length - 1; i++) {
      if (containsWord(tableData[i].Keywords)) {
        newTableData.push(tableData[i])
      }
    }
    setCurSearchTableData(newTableData)
    setCurTableData(newTableData)
  }

  const updateSearchText = event => {
    setSearchText(event.target.value)
  }
  const updateEndDate = event => {
    setEndDate(event.target.value)
  }


  useEffect(() => {
    updateTableContent();
  }, [endDate, startDate]);

  function Table() {
    return (
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Meeting</th>
              <th>Doc Title</th>
              <th>PDF</th>
              <th>Video</th>
            </tr>
            {curTableData.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.Date}</td>
                  <td>{val.Location}</td>
                  <td>{val.Meeting}</td>
                  <td>{val.DocTitle}</td>
                  <td>
                    <a href={val.PDF}>
                      <div>PDF</div>
                    </a>
                  </td>

                  <td>
                    <a href={val.Link}>
                      <div>link</div>
                    </a>
                  </td>
                </tr>
              )
            })}
          </thead>
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
      <button onClick={updateTableResults}>Search</button>
      <input type="text" onChange={updateSearchText} value={searchText}></input>
      <input type="date" onChange={updateStartDate} value={startDate}></input>
      <input type="date" onChange={updateEndDate} value={endDate}></input>
      <Table data={parsedData} />
    </>
  );
};



export default App;
