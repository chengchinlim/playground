import { DynamicModule, Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [
    {
      provide: "TemporalQueue_default",
      useValue: {
        start: Promise.resolve(),
        // Add other methods as required by your controller
      },
    },
  ],
  exports: ["TemporalQueue_default"],
})
export class TemporalMockModule {
  static registerWorker(options: any): DynamicModule {
    console.log("Registering mock Temporal worker with options:", options);
    // You can extend this to mock more specific behavior if needed
    return {
      module: TemporalMockModule,
    };
  }

  static registerClient(): DynamicModule {
    console.log("Registering mock Temporal client");
    // Similarly, extend this to simulate client behavior
    return {
      module: TemporalMockModule,
    };
  }
}
