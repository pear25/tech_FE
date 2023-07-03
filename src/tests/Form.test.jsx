import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter"
import { StoreProvider } from 'easy-peasy';
import store from "../store/store.jsx";
import Form from "../components/Form.jsx";
import '@testing-library/jest-dom/extend-expect';

describe('Form', () => {
    it('should reset the form when reset button is clicked', () => {
        const { getByPlaceholderText, getByText } =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        const startingInput = getByPlaceholderText("Starting Location");
        const dropOffInput = getByPlaceholderText("Drop off point");
        const resetButton = getByText("Reset");

        // Set some initial values in the form inputs
        fireEvent.change(startingInput, { target: { value: "Innocentre, Hong Kong" } });
        fireEvent.change(dropOffInput, { target: { value: "HKIA Terminal 1" } });

        // Click the reset button
        fireEvent.click(resetButton);
        expect
        // Check that the form inputs have been reset
        expect(startingInput.value).toBe("");
        expect(dropOffInput.value).toBe("");
    });

    it("is disabled when input fields are empty", () => {
        const { getByPlaceholderText, getByTestId, getByText } =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        const startingInput = getByPlaceholderText("Starting Location");
        const dropOffInput = getByPlaceholderText("Drop off point");

        expect(getByText("Submit").disabled).toBe(true);

        fireEvent.change(startingInput, { target: { value: "Innocentre" } });
        expect(getByText("Submit").disabled).toBe(true);

        fireEvent.change(dropOffInput, { target: { value: "HKIA Terminal 1" } });
        expect(getByText("Submit").disabled).toBe(false);

        fireEvent.click(getByTestId("starting-clear"))// Clear either input
        expect(getByText("Submit").disabled).toBe(true);
    });
});

describe("handle submit form function", () => {
    const mockAxios = new MockAdapter(axios)
    beforeEach(() => {
        <StoreProvider store={store}>
            <Form />
        </StoreProvider>
    })
    afterEach(() => {
        mockAxios.reset();
    });

    it("handles error response from the server", async () => {

        const { getByPlaceholderText } =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        const startingInput = getByPlaceholderText("Starting Location");
        const dropOffInput = getByPlaceholderText("Drop off point");
        // Set up mock error API response
        const data = {
            origin: "Innocentre",
            destination: "HKIA Terminal 1",
        };

        fireEvent.change(startingInput, {
            target: { value: data.origin },
        });
        fireEvent.change(dropOffInput, {
            target: { value: data.destination },
        });

        fireEvent.click(screen.getByText("Submit"));

        mockAxios.onPost("http://localhost:8080/route", data).reply(500);

        await waitFor(() => {
            const status = store.getState().status;
            expect(status).toBeDefined();
            expect(status).toEqual('server error');
        });
    })

    it("to indicate successfully calling api", async () => {
        const { getByPlaceholderText } =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        // Set up mock error API response
        const data = {
            origin: "Innocentre",
            destination: "HKIA Terminal 1",
        };
        const token = "12345";
        const routeResponse = {
            path: ["Innocentre", "HKIA Terminal 1"],
            total_distance: 1000,
            total_time: 120,
        };

        mockAxios.onPost("http://localhost:8080/route", data).reply(200, { token });
        mockAxios.onGet(`http://localhost:8080/route/${token}`).reply(200, routeResponse);

        fireEvent.change(screen.getByPlaceholderText("Starting Location"), {
            target: { value: data.origin },
        });
        fireEvent.change(screen.getByPlaceholderText("Drop off point"), {
            target: { value: data.destination },
        });
        fireEvent.click(screen.getByText("Submit"));
        await waitFor(() => {
            const status = store.getState().status;
            expect(status).toBeDefined();
            expect(status).toEqual('success');
        });
    })

})