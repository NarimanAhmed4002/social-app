export const emailTemplate = ({
  name,
  otp,
  emailSubject,
  body,
}: {
  name?: any;
  otp?: any;
  emailSubject?: any;
  body?: any;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    body{
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f5f7fa;
        margin: 0;
        padding: 0;
        color: #333;
        }
        .email-wrapper{
            max-width: 600px;
            margin: 30px auto;
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }
        .email-header{
            background-color: linear-gradient(135deg, #4facfe, #00f2fe);
            padding: 30px;
            color: #fff;
            text-align: center;
        }
        .email-header h1{
            margin: 0;
            font-size: 24px;
        }
        .email-body{
            padding: 30px;
        }
        .email-body p{
            font-size: 16px;
            line-height: 1.5;
            text-align: left;
        }
        .highlight{
            color: #4facfe;
            font-weight: bold;
        }
        .otp-box{
            display:inline-block;
            margin: 20px 0;
            padding: 15px 25px;
            background-color: #eaf6ff;
            border-radius: 8px;
            font-size: 26px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #0d47a1;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .email-footer{
            background-color: #f0f3f7;
            font-size: 13px;
            padding: 15px;
            text-align: center;
            color: #777;
        }
        .email-footer a{
            color: #4facfe;
            text-decoration: none;
        }
        </style>
    </head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <h1>${emailSubject}</h1>
        </div>
        <div class="email-body">
            <p>Hi <span class="highlight">${name}</span>,</p>
            <p>${body}</p>
            <div class = "otp-box">${otp}</div>
        </div>
        <div class="email-footer">
            <p>Copyright © 2025 Sara7a app. All rights reserved.</p>
            <p><a href = "#">Unsubscribe</a> | <a href = "#">Privacy Policy</a></p> 
        </div>
    </div>
</body>
</html>
`;
