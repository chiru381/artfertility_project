import React, { useRef } from 'react';
import ReactToPrint from "react-to-print";
import Receipt from '@material-ui/icons/Receipt';
import { PrimaryButton } from 'components/button';
import { Box, Grid } from '@material-ui/core';
import { images } from 'utils/constants';

import './invoice.css';

let patientInformation = [
    { label: "Patient No.", value: "123AB12" },
    { label: "Bill No.", value: "BILL1B12" },
    { label: "Patient Name", value: "John Wick" },
    { label: "Bill Date", value: "10-09-2021" },
    { label: "Age/Gender", value: "26/Female" },
    { label: "Partner Name", value: "Julie Khadka" },
    { label: "Doctor", value: "Dr. Shyam Karki" },
    { label: "Clinic", value: "Art Fertility" },
    { label: "Address", value: "Delhi, India" },
]


interface Props {

}

const ReceiptInvoice = (props: Props) => {
    let componentRef: any = useRef();
    return (
        <>
            <ReactToPrint
                trigger={() => (
                    <PrimaryButton
                        label="Generate Receipt"
                        endIcon={<Receipt />}
                    />
                )}
                content={() => componentRef.current}
            />
            <div style={{ display: "none" }}>
                <ComponentToPrint ref={componentRef} />
            </div>
        </>
    )
}

export default ReceiptInvoice;

class ComponentToPrint extends React.Component {
    render() {
        return (
            <div className="main-container">
                {/* Container */}
                <div className="container-fluid invoice-container">
                    {/* Header */}
                    <header>
                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                            <img src={images.appLogo} style={{ width: "140px" }} />
                            <h4 style={{ margin: "0px" }} className="text-7">Invoice</h4>
                            <div style={{ width: "140px" }} />
                        </div>
                        <hr />
                    </header>

                    {/* Main Content */}
                    <main>
                        <Box mb={3}>
                            <Grid container spacing={1}>
                                <Grid item xs={10}>
                                    <Grid container spacing={1}>
                                        {patientInformation.map((info, index) => (
                                            <Grid key={index} item xs={6}>
                                                <span><strong>{info.label}: </strong>{info.value}</span>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <div className="card">
                            <div className="card-body" style={{ padding: "0px" }}>
                                <div className="table-responsive">
                                    <table className="table mb-0">
                                        <thead className="card-header">
                                            <tr>
                                                <td className="col-5"><strong>Service</strong></td>
                                                <td className="col-2"><strong>SAC</strong></td>
                                                <td className="col-1 text-center"><strong>Quantity</strong></td>
                                                <td className="col-2 text-center"><strong>Rate</strong></td>
                                                <td className="col-2 text-end"><strong>Amount</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="col-5">Ultrasound</td>
                                                <td className="col-2">99.82.13</td>
                                                <td className="col-2 text-center">1</td>
                                                <td className="col-1 text-center">10000</td>
                                                <td className="col-2 text-end">10000</td>
                                            </tr>
                                            <tr>
                                                <td className="col-5">Blood Test</td>
                                                <td className="col-2">99.82.13</td>
                                                <td className="col-2 text-center">1</td>
                                                <td className="col-1 text-center">10000</td>
                                                <td className="col-2 text-end">10000</td>
                                            </tr>
                                            <tr>
                                                <td className="col-5">Follow Up</td>
                                                <td className="col-2">99.82.13</td>
                                                <td className="col-2 text-center">1</td>
                                                <td className="col-1 text-center">10000</td>
                                                <td className="col-2 text-end">10000</td>
                                            </tr>
                                        </tbody>
                                        <tfoot className="card-footer">
                                            <tr>
                                                <td colSpan={4} className="text-end"><strong>Gross Total(Rs.): </strong></td>
                                                <td className="text-end">30,000</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className="text-end"><strong>Total Bill Amount(Rs.): </strong></td>
                                                <td className="text-end">30,000</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className="text-end"><strong>Payment mode: </strong></td>
                                                <td className="text-end">Card</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className="text-end border-bottom-0"><strong>Paid Amt (Rs.): </strong></td>
                                                <td className="text-end border-bottom-0">30,000</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>


                        <table className="mt-4">
                            <tbody>
                                <tr>
                                    <td><strong>Remarks:</strong></td>
                                    <td>Good Patient</td>
                                </tr>
                                <tr>
                                    <td><strong>Printed on:</strong></td>
                                    <td>07-10-2021</td>
                                </tr>
                                <tr>
                                    <td className="col-2"><strong>Signature:</strong></td>
                                    <td className="col-2"></td>
                                    <td className="text-end col-5"><strong>Prep By:</strong></td>
                                    <td className="col-3"></td>
                                </tr>
                            </tbody>
                        </table>

                    </main>

                    {/* Footer */}
                    <footer className="text-center mt-4">
                        <p className="text-1"><strong>NOTE :</strong> This is computer generated receipt and does not require physical signature.</p>
                    </footer>
                </div>

            </div>
        );
    }
}

