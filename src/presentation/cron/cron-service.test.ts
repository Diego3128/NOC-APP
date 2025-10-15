import { CronService } from "./cron-service";
describe("src/presentation/cron/cron-service.ts", () => {
  //
  const mockTick = jest.fn();
  //
  test("should create a job", (done) => {
    const job = CronService.createCronJob({
      cronTime: "* * * * * *",
      onTick: mockTick,
    });

    setTimeout(() => {
      expect(mockTick).toHaveBeenCalledTimes(2);
      job.stop();
      done();
    }, 2000);
  });
  //
});
