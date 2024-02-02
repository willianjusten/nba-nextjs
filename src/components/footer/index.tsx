const linkStyle = "border-b-blue-500 text-blue-500 hover:border-b-[1px]";

function Footer() {
  return (
    <footer className="container mx-auto px-4 pb-8 pt-16 text-center">
      <p className="flex justify-center gap-2">
        <span>Created with</span>
        <span className="text-rose-600">♥️</span>
        <span>by</span>
        <a
          className={linkStyle}
          href="https://willianjusten.com.br/"
          target="_blank"
          rel="noreferrer"
        >
          Willian Justen
        </a>
      </p>
    </footer>
  );
}

export default Footer;
