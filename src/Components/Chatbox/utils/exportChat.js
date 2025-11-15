// src/Components/Chatbox/utils/exportChat.js

/* -----------------------------
   EXPORT CHAT AS TEXT (.txt)
------------------------------ */
export function exportChatAsText(messages) {
    if (!messages || !messages.length) return;
  
    let text = "💬 Wanderly Genie - Chat Export\n\n";
    messages.forEach((msg) => {
      const sender = msg.sender === "user" ? "You" : "Genie";
      text += `${sender}: ${msg.text}\n\n`;
    });
  
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "Wanderly_Genie_Chat.txt";
    a.click();
  
    URL.revokeObjectURL(url);
  }
  
  /* -----------------------------
     EXPORT CHAT AS PRINT (PDF)
     (Browser print → Save as PDF)
  ------------------------------ */
  export function exportChatAsPrintable(messages) {
    if (!messages || !messages.length) return;
  
    const printWindow = window.open("", "_blank", "width=800,height=900");
  
    const html = `
      <html>
        <head>
          <title>Wanderly Genie - Chat Export</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background: #f5f5f5;
            }
            h2 {
              text-align:center;
              margin-bottom:20px;
            }
            .bubble {
              max-width: 80%;
              padding: 12px 16px;
              margin: 10px 0;
              border-radius: 14px;
              line-height: 1.5;
            }
            .user {
              background: #d1eaff;
              margin-left: auto;
            }
            .bot {
              background: #ece1ff;
              margin-right: auto;
            }
          </style>
        </head>
        <body>
          <h2>✨ Wanderly Genie - Chat Export</h2>
  
          ${messages
            .map((m) => {
              const cls = m.sender === "user" ? "user" : "bot";
              return `<div class="bubble ${cls}">${m.text.replace(/\n/g, "<br>")}</div>`;
            })
            .join("")}
            
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;
  
    printWindow.document.write(html);
    printWindow.document.close();
  }
  