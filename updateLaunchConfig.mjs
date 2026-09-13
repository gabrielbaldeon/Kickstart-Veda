/**
 * Contentstack Launch Configuration Generator
 *
 * This script automatically generates a launch.json file for Contentstack Launch deployments.
 * It fetches all content URLs from your Contentstack stack and creates a cache priming
 * configuration to optimize the initial deployment.
 *
 * What it does:
 * 1. Connects to your Contentstack stack using environment variables
 * 2. Fetches URLs from all content types (pages, products, categories, product lines)
 * 3. Generates a launch.json file with a list of URLs for cache priming
 * 4. Enables Contentstack Launch to pre-cache these pages during deployment
 *
 * Why cache priming matters:
 * - Ensures all pages are built and cached during deployment
 * - Improves first-visit performance for users
 * - Prevents cold-start delays on initial page requests
 * - Optimizes CDN distribution across edge locations
 *
 * When it runs:
 * - Automatically executed before each build (see package.json "prebuild" script)
 * - Can be run manually: node updateLaunchConfig.mjs
 *
 * Requirements:
 * - .env.local file with valid Contentstack credentials
 * - Active internet connection to fetch content from Contentstack
 */

import fs from "fs";
import path from "path";
import contentstack from "@contentstack/delivery-sdk";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config();

/**
 * Fetches all URLs from Contentstack content types
 *
 * This function queries multiple content types in parallel and extracts
 * their URL fields to build a comprehensive list of all pages in the site.
 *
 * @returns {Promise<string[]>} Array of all page URLs
 */
async function getAllLinks() {
  // Initialize Contentstack SDK with credentials from environment variables
  const stack = contentstack.stack({
    apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
    deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
    region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION,
  });

  // Fetch URLs from all content types in parallel for better performance
  // Note: We only request the 'url' field to minimize payload size
  const [pages, products, categories, productLines] = await Promise.all([
    stack.contentType("page").entry().only(["url"]).query().find(),
    stack.contentType("product").entry().only(["url"]).query().find(),
    stack.contentType("category").entry().only(["url"]).query().find(),
    stack.contentType("product_line").entry().only(["url"]).query().find(),
  ]);

  // Extract URLs from each content type, with fallback to empty array
  const pageUrls = pages.entries?.map((e) => e.url) || [];
  const productUrls = products.entries?.map((e) => e.url) || [];
  const categoryUrls = categories.entries?.map((e) => e.url) || [];
  const productLineUrls = productLines.entries?.map((e) => e.url) || [];

  // Combine all URLs and include the main products listing page
  return [
    ...pageUrls,
    ...productUrls,
    ...categoryUrls,
    ...productLineUrls,
    "/products",
  ];
}

/**
 * Generates and writes the launch.json configuration file
 *
 * This file is used by Contentstack Launch to configure cache priming.
 * Cache priming ensures that all listed URLs are pre-rendered and cached
 * at the CDN edge locations during the deployment process.
 */
async function updateLaunchJson() {
  try {
    console.log("🔍 Fetching content URLs from Contentstack...");

    // Fetch all URLs from the stack
    const urls = await getAllLinks();

    console.log(`✅ Found ${urls.length} URLs to prime in cache`);

    // Create the Launch configuration object
    const launchData = {
      cache: {
        cachePriming: {
          urls: urls,
        },
      },
    };

    // Write the configuration to launch.json in the project root
    const filePath = path.resolve("./launch.json");
    fs.writeFileSync(filePath, JSON.stringify(launchData, null, 2));

    console.log("✨ launch.json updated successfully!");
    console.log(`📝 Cache priming configured for ${urls.length} pages`);
  } catch (error) {
    console.error("❌ Error updating launch.json:", error);
    // Don't fail the build if this script errors - it's an optimization, not a requirement
    process.exit(0);
  }
}

// Execute the update when this script is run
updateLaunchJson();
