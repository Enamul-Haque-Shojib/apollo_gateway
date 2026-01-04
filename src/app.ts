
// import express, { type Application, type Request, type Response } from "express";
// import { expressMiddleware } from "@as-integrations/express5";


// import { RemoteGraphQLDataSource } from "@apollo/gateway";
// import { ApolloServer } from '@apollo/server';
// import { ApolloGateway } from '@apollo/gateway';
// import { AuthUser, verifyToken } from "./auth/verifyToken";
// // import gql from "graphql-tag";
// import bodyParser from "body-parser";
// import cors from "cors";
// import { readFileSync } from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app: Application = express();
// app.use(express.json());



// const supergraphSdl = readFileSync(
//   path.join(__dirname, "../../supergraph.graphql"),
//   "utf-8"
// );

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://yourdomain.com"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );



// app.get("/", (_req: Request, res: Response) => {
//   res.send({ message: "Apollo Gateway Server is running..." });
// });


// const gateway = new ApolloGateway({
//   supergraphSdl,

//      buildService({ url }) {
//   return new RemoteGraphQLDataSource({
//     url,
//     willSendRequest({ request, context }) {
//       if (context.user) {
//         request.http?.headers.set(
//           "x-user",
//           JSON.stringify(context.user)
//         );
//       }
//     },
//   });
// }

// });

// const server = new ApolloServer({
//   gateway,
//   csrfPrevention: true,
// });

// await server.start();

// app.use(
//   "/graphql",
//       cors(),
//       bodyParser.json(),
//   expressMiddleware(server, {
//     context: async ({ req }) => {
       
//       const authHeader = req.headers.authorization;
       
//       let user: AuthUser | null = null;

//       // 2. Verify token if exists
//       if (authHeader?.startsWith("Bearer ")) {
//         const token = authHeader.split(" ")[1];

        
//         if(!token) throw new Error('Invalid Token')

//         try {
//           user = verifyToken(token);
        
//         } catch (err) {
//           throw new Error("Invalid or expired token");
//         }
//       }

//       return {
//         user,
//       };
//     },
//   })
// );




// export default app;







import express, { type Application, type Request, type Response } from "express";
import { expressMiddleware } from "@as-integrations/express5";


import { RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from '@apollo/server';
import { ApolloGateway } from '@apollo/gateway';
import { AuthUser, verifyToken } from "./auth/verifyToken";
// import gql from "graphql-tag";
import bodyParser from "body-parser";
import cors from "cors";
import { readFileSync } from "fs";
import path from "path";



const app: Application = express();
app.use(express.json());


const supergraphSdl = readFileSync(
  path.resolve(process.cwd(), "src/schema/supergraph.graphql"),
  "utf-8"
);






app.get("/", (_req: Request, res: Response) => {
  res.send({ message: "Apollo Gateway Server is running..." });
});


const gateway = new ApolloGateway({
  supergraphSdl,

     buildService({ url }) {
  return new RemoteGraphQLDataSource({
    url,
    willSendRequest({ request, context }) {
      if (context.user) {
        request.http?.headers.set(
          "x-user",
          JSON.stringify(context.user)
        );
      }
    },
  });
}

});

async function startApolloServer() {
const server = new ApolloServer({
  gateway,
  csrfPrevention: true,
});

await server.start();

app.use(
  "/graphql",
       cors({
      origin: [
        "http://localhost:3000",
        "https://your-frontend.vercel.app", // frontend URL
      ],
      credentials: true,
    }),
      bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
       
      const authHeader = req.headers.authorization;
       
      let user: AuthUser | null = null;

      // 2. Verify token if exists
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        
        if(!token) throw new Error('Invalid Token')

        try {
          user = verifyToken(token);
        
        } catch (err) {
          throw new Error("Invalid or expired token");
        }
      }

      return {
        user,
      };
    },
  })
);
}


export { app, startApolloServer };



