import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter"
import { StoreProvider } from 'easy-peasy';
import store from "../store/store.jsx";
import Form from "../components/Form.jsx";
import { vi, describe, expect, it } from "vitest";
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
        const screen =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        const startingInput = screen.getByPlaceholderText("Starting Location");
        const dropOffInput = screen.getByPlaceholderText("Drop off point");

        expect(screen.getByText("Submit").disabled).toBe(true);

        fireEvent.change(startingInput, { target: { value: "Innocentre" } });
        expect(screen.getByText("Submit").disabled).toBe(true);

        fireEvent.change(dropOffInput, { target: { value: "HKIA Terminal 1" } });
        expect(screen.getByText("Submit").disabled).toBe(false);

        fireEvent.click(screen.getByTestId("starting-clear"))// Clear either input
        expect(screen.getByText("Submit").disabled).toBe(true);
    });
});

describe("handle submit form function", () => {
    const mockAxios = new MockAdapter(axios)
    const data = {
        origin: "Innocentre",
        destination: "Hong Kong International Airport"
    }
    const token = "123445"

    afterEach(() => {
        mockAxios.reset();
    });

    it("post request success is handled properly", async () => {
        const screen =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        mockAxios.onPost('http://localhost:8080/route', data).reply(200, { token: token });
        const startingInput = screen.getByPlaceholderText("Starting Location");
        const dropOffInput = screen.getByPlaceholderText("Drop off point");
        fireEvent.change(startingInput, {
            target: { value: data.origin },
        });
        fireEvent.change(dropOffInput, {
            target: { value: data.destination },
        });
        fireEvent.click(screen.getByText("Submit"));
        await waitFor(() => {
            const status = store.getState().status
            expect(status).toEqual('calling');
        });
    })

    it("post request error is handled properly", async () => {
        const screen =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        mockAxios.onPost('http://localhost:8080/route', data).reply(500);
        const startingInput = screen.getByPlaceholderText("Starting Location");
        const dropOffInput = screen.getByPlaceholderText("Drop off point");
        fireEvent.change(startingInput, {
            target: { value: data.origin },
        });
        fireEvent.change(dropOffInput, {
            target: { value: data.destination },
        });
        fireEvent.click(screen.getByText("Submit"));
        await waitFor(() => {
            const status = store.getState().status
            expect(status).toEqual('server error');
        });
    })

    it("get request error is handled properly", async () => {
        const screen =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        mockAxios.onGet(`http://localhost:8080/route/${token}`).reply(500);
        const startingInput = screen.getByPlaceholderText("Starting Location");
        const dropOffInput = screen.getByPlaceholderText("Drop off point");
        fireEvent.change(startingInput, {
            target: { value: data.origin },
        });
        fireEvent.change(dropOffInput, {
            target: { value: data.destination },
        });
        fireEvent.click(screen.getByText("Submit"));
        await waitFor(() => {
            const status = store.getState().status
            expect(status).toBe("server error")
        });
    });

    it("get request success is handled properly", async () => {
        const screen =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        const successResponse = {
            status: "success",
            path: [['22.234511', '24.332145']],
            total_distance: 20000,
            total_time: 1800
        }
        mockAxios.onPost('http://localhost:8080/route').reply(200, { token: token })
        mockAxios.onGet(`http://localhost:8080/route/${token}`).reply(200, { successResponse });
        const startingInput = screen.getByPlaceholderText("Starting Location");
        const dropOffInput = screen.getByPlaceholderText("Drop off point");

        fireEvent.change(startingInput, {
            target: { value: data.origin },
        });
        fireEvent.change(dropOffInput, {
            target: { value: data.destination },
        });
        fireEvent.click(screen.getByText("Submit"));

        waitFor(() => {
            const status = store.getState().status
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(status).toEqual("success")
        })

    })

    it("get request busy is handled properly", async () => {
        const screen =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        const busyResponse = {
            status: "in progress",
        }
        mockAxios.onPost('http://localhost:8080/route').reply(200, { token: token })
        mockAxios.onGet(`http://localhost:8080/route/${token}`).reply(200, { busyResponse });
        const startingInput = screen.getByPlaceholderText("Starting Location");
        const dropOffInput = screen.getByPlaceholderText("Drop off point");

        fireEvent.change(startingInput, {
            target: { value: data.origin },
        });
        fireEvent.change(dropOffInput, {
            target: { value: data.destination },
        });
        fireEvent.click(screen.getByText("Submit"));

        waitFor(() => {
            const status = store.getState().status
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(status).toEqual("success")
        })

    })

    it("get request fail is handled properly", async () => {
        const screen =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)
        const failResponse = {
            status: "failure",
            error: "Location not accessible by car"
        }
        mockAxios.onPost('http://localhost:8080/route').reply(200, { token: token })
        mockAxios.onGet(`http://localhost:8080/route/${token}`).reply(200, { failResponse });
        const startingInput = screen.getByPlaceholderText("Starting Location");
        const dropOffInput = screen.getByPlaceholderText("Drop off point");

        fireEvent.change(startingInput, {
            target: { value: data.origin },
        });
        fireEvent.change(dropOffInput, {
            target: { value: data.destination },
        });
        fireEvent.click(screen.getByText("Submit"));

        waitFor(() => {
            const status = store.getState().status
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(status).toEqual("fail")
        })

    })

    it("get request error is handled properly", async () => {
        const screen =
            render(<StoreProvider store={store}>
                <Form />
            </StoreProvider>)

        mockAxios.onPost('http://localhost:8080/route').reply(200, { token: token })
        mockAxios.onGet(`http://localhost:8080/route/${token}`).reply(500);
        const startingInput = screen.getByPlaceholderText("Starting Location");
        const dropOffInput = screen.getByPlaceholderText("Drop off point");

        fireEvent.change(startingInput, {
            target: { value: data.origin },
        });
        fireEvent.change(dropOffInput, {
            target: { value: data.destination },
        });
        fireEvent.click(screen.getByText("Submit"));

        waitFor(() => {
            const status = store.getState().status
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(status).toEqual("server error")
        })

    })
})

