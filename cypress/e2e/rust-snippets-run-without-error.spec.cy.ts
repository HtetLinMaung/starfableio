describe("Rust Code Snippets Compilation Test for All Blogs", () => {
  const rootUrl = "http://localhost:4321";
  const blogUrls = [`${rootUrl}/blogs/why-rust-stands-out`];

  // Use correct temp directory path based on OS
  const isWindows = Cypress.platform === "win32";
  const tempDir = isWindows ? "cypress\\tmp" : "./cypress/tmp";

  // Determine the platform-specific commands for Windows and Unix-like systems
  const rmCommand = isWindows ? `rmdir /S /Q ${tempDir.replace(/\//g, "\\")}` : `rm -rf ${tempDir}`;
  const rustcCommand = isWindows ? "rustc.exe" : "rustc";

  // Enhanced error handling for uncaught JavaScript exceptions
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Log the error for debugging but prevent test from failing
    if (err.message.includes("Cannot read properties of undefined (reading 'id')")) {
      console.error('Ignoring uncaught error:', err.message);
      return false; // Prevent Cypress from failing the test
    }
    return true; // Let other exceptions cause the test to fail
  });

  // Helper function to compile Rust code snippets
  const compileRustSnippet = (rustCode, index) => {
    const snippetFilePath = `${tempDir}/snippet${index}.rs`.replace(/\//g, isWindows ? "\\" : "/");
    const outputFilePath = `${tempDir}/snippet${index}`.replace(/\//g, isWindows ? "\\" : "/");

    // Save the Rust code snippet to a temporary file
    cy.writeFile(snippetFilePath, rustCode);

    // Compile the Rust code snippet using rustc
    cy.exec(`${rustcCommand} ${snippetFilePath} -o ${outputFilePath}`, {
      failOnNonZeroExit: false,
    })
      .its("stderr")
      .should("be.empty"); // Ensure no compilation errors
  };

  blogUrls.forEach((url) => {
    context(`Testing Rust code snippets on: ${url}`, () => {
      beforeEach(() => {
        cy.visit(url); // Visit the blog page
      });

      it("should compile all Rust code snippets without errors", () => {
        // Find all Rust code snippets inside <pre> tags with the class "language-rust"
        cy.get("pre.language-rust").each(($pre, index) => {
          const rustCode = $pre.text(); // Extract the Rust code
          compileRustSnippet(rustCode, index); // Compile each snippet
        });

        // Simulate page interaction, ensure the element is ready before interacting
        cy.get("#svg-span").should("exist").and("be.visible").click();

        // Wait for the location to change after clicking
        cy.location("pathname").should("not.eq", url.replace(rootUrl, ""));

        // Find and compile Rust code snippets on the new page
        cy.get("pre.language-rust").each(($pre, index) => {
          const rustCode = $pre.text(); // Extract the Rust code
          compileRustSnippet(rustCode, index); // Compile each snippet
        });
      });

      after(() => {
        // Clean up by deleting the temporary Rust files after all tests
        cy.exec(`${rmCommand}`, { failOnNonZeroExit: false });
      });
    });
  });
});
