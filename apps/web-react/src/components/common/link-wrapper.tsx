import { RefAttributes } from "react";
import { Link, LinkProps } from "react-router-dom";

export function LinkWrapper(
	props: Omit<LinkProps & RefAttributes<HTMLAnchorElement>, "to"> & {
		href: string;
	},
) {
	return <Link {...props} to={props.href} />;
}
