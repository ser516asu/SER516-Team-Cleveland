import axios from "axios";
import { useEffect, useState } from "react";
import { Dropdown, Spinner, Stack } from "react-bootstrap";
import Areachart from "../areachart";

const SprintDetail = ({ sprintDetails, attributes, token }) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [bvAttribute, setBvAttribute] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        const attribute = attributes.map(attribute => {
            console.log(attribute.id);
            if (attribute.name.toLowerCase() === "bv" || attribute.name.toLowerCase()=== "business value") {
                // setBvAttribute(attribute.id);
                return attribute.id;
            }
            else {
                return null;
            }
        });
        setBvAttribute(attribute);
    }, [attributes]);

    const handleSelect = (eventKey) => {
        console.log(bvAttribute);
        const splitEventKey = eventKey.split(',');
        setSelectedValue(splitEventKey[1]);
        setError(false);
        setSpinner(true);

        axios({
            url: "http://localhost:8000/metric/Burndown",
            method: "post",
            data: {
                milestoneId: splitEventKey[0],
                attributeKey: bvAttribute[0].toString()
            },
            headers: {
                "token": token,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000/project"
            }
        })
        .then(res => {
            setData(res.data);
            console.log(res.data);
            setError(false);
            setSpinner(false);
        })
        .catch(ex => {
            console.log(ex);
            setError(true);
            setSpinner(false);
        });
    }

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ height: '80%', width: '90%', maxHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Stack gap={4} className="col-md-5 mx-auto">
                    <div className="d-flex align-items-center justify-content-center vh-100 backgroundWhite">

                        <br />
                        <Dropdown onSelect={handleSelect}>
                            <Dropdown.Toggle variant="outline-secondary" className="backgroundButton">
                                {selectedValue ? selectedValue : 'Select Metric'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    sprintDetails.map((item) => <Dropdown.Item key={item.id} eventKey={[item.id, item.name]}>{item.name}</Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>

                        {spinner ? <Spinner variant="primary" animation="border" style={{ justifyContent: "center", alignItems: "center", display:"flex", marginLeft: "49%" }} /> : null}
                    </div>

                    {error ? (
                        <p className="errorMessage">Unable to fetch Sprint Detail</p>
                    ) : null}
                    
                    {data ? (
                        <div>
                            <br />
                            <Areachart apiData={data.total_burndown.total_burndown_data} chartFor={"Total Burndown Chart"} title={"Total Burndown Chart"} />
                            <Areachart apiData={data.partial_burndown.partial_burndown_data} chartFor={"Partial Burndown Chart"} title={"Partial Burndown Chart"} />
                            <Areachart apiData={data.bv_burndown.bv_burndown_data} chartFor={"Business Value Burndown Chart"} title={"Business Value Burndown Chart"} />
                        </div>
                    ) : null}
                </Stack>
            </div>
        </div>
    )
}

export default SprintDetail;