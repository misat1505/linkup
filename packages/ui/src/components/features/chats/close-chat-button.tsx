"use client";

import { RxCross1 } from "react-icons/rx";
import { LINK_COMPONENT, TRANSLATION_COMPONENT } from "../../../config";
import { Tooltip } from "../../misc/tooltip";

export function CloseChatButton() {
  return (
    <Tooltip
      content={<TRANSLATION_COMPONENT translationKey="chats.close.tooltip" />}
    >
      <span className="transition-all hover:scale-125">
        <LINK_COMPONENT href="/chats">
          <RxCross1 size={16} />
        </LINK_COMPONENT>
      </span>
    </Tooltip>
  );
}
