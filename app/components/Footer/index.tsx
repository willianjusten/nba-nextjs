import { Fragment } from "react";
const linkStyle = "border-b-blue-500 text-blue-500 hover:border-b-[1px]";

const authors = [
  {
    name: "Willian Justen",
    href: "https://willianjusten.com.br/",
  },
  {
    name: "Marcus Silva",
    href: "https://github.com/mvfsillva",
  },
];

function Footer() {
  return (
    <footer className="container mx-auto px-4 pb-8 pt-16 text-center">
      <p className="flex justify-center gap-2">
        <span>Created with</span>
        <span className="text-rose-600">♥️</span>
        <span>by</span>
        {authors.map((item, index) => (
          <Fragment key={index}>
            <a
              className={linkStyle}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.name}
            </a>
            {index < authors.length - 1 && " and "}
          </Fragment>
        ))}
      </p>
    </footer>
  );
}

export default Footer;
