import React from "react";
import { render, screen } from "@testing-library/react";
import AlertBox from "../components/AlertBox.jsx";
import '@testing-library/jest-dom/extend-expect';

describe("AlertBox", () => {
    it("should render a fail alert if status is 'fail'", () => {
        render(<AlertBox status="fail" />);
        const failAlert = screen.getByRole("fail");
        expect(failAlert).toBeInTheDocument();
    });

    it("should render a busy alert if status is 'busy'", () => {
        render(<AlertBox status="busy" />);
        const busyAlert = screen.getByRole("busy");
        expect(busyAlert).toBeInTheDocument();
    });

    it("should render a server error alert if status is 'server error'", () => {
        render(<AlertBox status="server error" />);
        const serverErrorAlert = screen.getByRole("error");
        expect(serverErrorAlert).toBeInTheDocument();
    });

    it("should render a success alert if status is 'success'", () => {
        const mapData = {
            total_distance: "10 km",
            total_time: "20 mins",
        };
        render(<AlertBox status="success" mapData={mapData} />);
        const successAlert = screen.getByRole("success");
        expect(successAlert).toBeInTheDocument();
        expect(screen.getByText(`Total Distance: ${mapData.total_distance}`)).toBeInTheDocument();
        expect(screen.getByText(`Total time: ${mapData.total_time}`)).toBeInTheDocument();
    });

    it("should render a calling alert if status is 'calling'", () => {
        render(<AlertBox status="calling" />);
        const callingAlert = screen.getByRole("calling");
        expect(callingAlert).toBeInTheDocument();
    });
});