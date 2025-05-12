import { Aws } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import * as custom from "aws-cdk-lib/custom-resources";
import { movies, reviews  } from "../seed/movies";
import { generateBatch } from "../shared/util";

type AppApiProps = {
  userPoolId: string;
  userPoolClientId: string;
};

export class AppApi extends Construct {
  constructor(scope: Construct, id: string, props: AppApiProps) {
    super(scope, id);

    const moviesTable = new dynamodb.Table(this, "MoviesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Movies",
    });

    const movieReviewsTable = new dynamodb.Table(this, "MovieReviewsTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "reviewId", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "MovieReviews",
    });

    const getMovieByIdFn = new lambdanode.NodejsFunction(
      this,
      "GetMovieByIdFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/app-api/getMovieById.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: moviesTable.tableName,
          REGION: 'eu-west-1',
        },
      }
      );
      
      const getAllMoviesFn = new lambdanode.NodejsFunction(
        this,
        "GetAllMoviesFn",
        {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_18_X,
          entry: `${__dirname}/../lambdas/app-api/getAllMovies.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: moviesTable.tableName,
            REGION: 'eu-west-1',
          },
        }
        );

        const newMovieFn = new lambdanode.NodejsFunction(this, "AddMovieFn", {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          entry: `${__dirname}/../lambdas/app-api/addMovie.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: moviesTable.tableName,
            REGION: "eu-west-1",
          },
        });

      
    const getReviewsFn = new lambdanode.NodejsFunction
    (this, "GetReviewsFn", 
    {
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `${__dirname}/../lambdas/app-api/getReviews.ts`,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });

    const postReviewFn = new lambdanode.NodejsFunction(this, "PostReviewFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `${__dirname}/../lambdas/app-api/postReview.ts`,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });
    
    const updateReviewFn = new lambdanode.NodejsFunction(this, "UpdateReviewFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `${__dirname}/../lambdas/app-api/updateReview.ts`,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });

        
        new custom.AwsCustomResource(this, "moviesddbInitData", {
          onCreate: {
            service: "DynamoDB",
            action: "batchWriteItem",
            parameters: {
              RequestItems: {
                [moviesTable.tableName]: generateBatch(movies),
                [movieReviewsTable.tableName]: generateBatch(reviews),  
              },
            },
            physicalResourceId: custom.PhysicalResourceId.of("moviesddbInitData"),
          },
          policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
            resources: [moviesTable.tableArn,  movieReviewsTable.tableArn], 
          }),
        });
        console.log("Seeding Reviews:", generateBatch(reviews).length);
        console.log("Review seed preview:", reviews);

        
        // Permissions 
        moviesTable.grantReadData(getMovieByIdFn)
        moviesTable.grantReadData(getAllMoviesFn)
        moviesTable.grantReadWriteData(newMovieFn)

        movieReviewsTable.grantReadWriteData(getReviewsFn);
        movieReviewsTable.grantReadWriteData(postReviewFn);
        movieReviewsTable.grantReadWriteData(updateReviewFn);
      

    
    const api = new apig.RestApi(this, "AppApi", {
      description: "App RestApi",
      endpointTypes: [apig.EndpointType.REGIONAL],
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    const appCommonFnProps = {
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "handler",
      environment: {
        USER_POOL_ID: props.userPoolId,
        CLIENT_ID: props.userPoolClientId,
        REGION: cdk.Aws.REGION,
      },
    };

     const authorizerFn = new lambdanode.NodejsFunction(this, "AuthorizerFn", {
          ...appCommonFnProps,
          entry: "./lambdas/auth/authorizer.ts",
        });
        const requestAuthorizer = new apig.RequestAuthorizer(
          this,
          "RequestAuthorizer",
          {
            identitySources: [apig.IdentitySource.header("cookie")],
            handler: authorizerFn,
            resultsCacheTtl: cdk.Duration.minutes(0),
          }
        );

     // Movies endpoint
            const moviesEndpoint = api.root.addResource("movies");
            moviesEndpoint.addMethod(
              "GET",
              new apig.LambdaIntegration(getAllMoviesFn, { proxy: true })
            );
            const specificMovieEndpoint = moviesEndpoint.addResource("{movieId}");
            specificMovieEndpoint.addMethod(
              "GET",
              new apig.LambdaIntegration(getMovieByIdFn, { proxy: true })
            );
            moviesEndpoint.addMethod(
              "POST",
              new apig.LambdaIntegration(newMovieFn, { proxy: true })
            );
            const movieCastEndpoint = moviesEndpoint.addResource("cast");
    
      //Reviews endpoints
            const movieReviewsEndpoint = moviesEndpoint.addResource("reviews");
            const reviewsByMovieId = movieReviewsEndpoint.addResource("{movieId}");
            reviewsByMovieId.addMethod(
              "GET", 
              new apig.LambdaIntegration(getReviewsFn, { proxy: true }));
            movieReviewsEndpoint.addMethod(
              "POST", 
              new apig.LambdaIntegration(postReviewFn, { proxy: true }),
            {
              authorizer: requestAuthorizer,
              authorizationType: apig.AuthorizationType.CUSTOM,
            });     
            const reviewsPath = specificMovieEndpoint.addResource("reviews");
            const reviewIdPath = reviewsPath.addResource("{reviewId}");
            reviewIdPath.addMethod(
              "PUT", 
              new apig.LambdaIntegration(updateReviewFn),
            {
              authorizer: requestAuthorizer,
              authorizationType: apig.AuthorizationType.CUSTOM,
            });
  }
}
