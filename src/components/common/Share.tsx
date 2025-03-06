"use client";

import { EmailShareButton, FacebookShareButton } from "react-share";
import { Button } from "./button/Button";
import { Facebook, Link, Mail, Twitter } from "lucide-react";

export default function Share() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <>
      <FacebookShareButton url={""} hashtag="#code">
        <Button outlined={true}>
          <Facebook className="h-4 w-4" />
        </Button>
      </FacebookShareButton>

      <Button outlined={true}>
        <Twitter className="h-4 w-4" />
      </Button>
      <EmailShareButton
        url="https://www.npmjs.com/package/react-share"
        // subject="Check out this awesome library"
      >
        <Button outlined={true}>
          <Mail className="h-4 w-4" />
        </Button>
      </EmailShareButton>

      <Button outlined={true}>
        <Link className="h-4 w-4" />
      </Button>
    </>
  );
}
