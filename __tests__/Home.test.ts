import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Home from "../src/app/page";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      Airports: [
        { id: 1, name: 'Amsterdam Airport', code: 'AMS' },
        { id: 2, name: 'Rotterdam Airport', code: 'RTM' },
      ],
    }),
  })
) as jest.Mock

describe('Home component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches airports from the API and renders correctly', async () => {
    const ui = await Home();
    render(ui);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/airports');
  })
})