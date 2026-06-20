import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { API_CONTRACT } from "@packages/api-contract";

const registry = new OpenAPIRegistry();

function registerRoutes() {
	registry.registerComponent("securitySchemes", "bearerAuth", {
		type: "http",
		scheme: "bearer",
		bearerFormat: "JWT",
	});

	Object.values(API_CONTRACT).forEach((route) => {
		registry.registerPath(route);
	});
}

export function generateOpenApiDocument() {
	registerRoutes();

	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			title: "Nexus API",
			version: "1.0.0",
			description: "API documentation for Nexus",
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	});
}
