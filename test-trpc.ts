async function testTRPC() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/trpc/events.getAll",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("Response not ok:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error body:", errorText);
      return;
    }

    const data = await response.json();
    console.log("tRPC response:", data);

    if (data.result && data.result.data) {
      console.log("Events count:", data.result.data.length);
      console.log("First event keys:", Object.keys(data.result.data[0] || {}));
    }
  } catch (error) {
    console.error("tRPC test error:", error);
  }
}

testTRPC();
