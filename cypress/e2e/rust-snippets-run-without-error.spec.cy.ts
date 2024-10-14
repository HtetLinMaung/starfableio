describe("Rust Code Snippets Compilation Test for All Blogs", () => {
  const rootUrl = "http://localhost:4321";
  const blogUrls = [`${rootUrl}/blogs/why-rust-stands-out`];
  const tempDir = "./cypress/tmp";

  // Helper function to compile Rust code snippets
  const compileRustSnippet = (rustCode, index) => {
    const snippetFilePath = `${tempDir}/snippet${index}.rs`;
    const outputFilePath = `${tempDir}/snippet${index}`; // Binary output path

    // Save the Rust code snippet to a temporary file
    cy.writeFile(snippetFilePath, rustCode);

    // Compile the Rust code snippet with rustc, generating the output in the tmp folder
    cy.exec(`rustc ${snippetFilePath} -o ${outputFilePath}`, {
      failOnNonZeroExit: false,
    })
      .its("stderr")
      .should("be.empty"); // Ensure there are no compilation errors
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

        // Simulate page interaction
        cy.get("#svg-span").click();

        // Wait for the location to change after clicking
        cy.location("pathname").should("not.eq", url.replace(rootUrl, ""));

        // Find and compile Rust code snippets on the new page
        cy.get("pre.language-rust").each(($pre, index) => {
          const rustCode = $pre.text(); // Extract the Rust code
          compileRustSnippet(rustCode, index); // Compile each snippet
        });
      });

      after(() => {
        // Delete the temporary Rust files after all tests
        cy.exec(`rm -rf ${tempDir}`);
      });
    });
  });
});
