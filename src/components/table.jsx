

import React from "react"

export default function Table(data) {

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
                {data.products.map((val, key) => {
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