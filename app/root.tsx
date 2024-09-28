import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import Header from "./components/Header";
import { TextFieldProps } from './components/TextField';
import { YearListProps } from './components/YearList';

export function Layout({ children }: { children: React.ReactNode }) {
  const yearListProps: YearListProps = {
    selectedYear: 2021,
    years: [2021, 2020, 2019, 2018],
  };
  const textFieldProps: TextFieldProps = {
    value: '',
    onChange: () => {},
  };


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-noto-sans-jp text-text-color bg-bg-color">
        <Header yearListProps={yearListProps} textFieldProps={textFieldProps} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
