import { CAPTURED_POINT_COOLDOWN_SECONDS } from "./repository/user";

export class CapturedPointInCooldownError extends Error {
  public secondsSincecaptured: number;

  constructor(secondsSincecaptured: number) {
    super(
      `Point in cooldown: ${secondsSincecaptured}s/${CAPTURED_POINT_COOLDOWN_SECONDS}s`
    );
    this.secondsSincecaptured = secondsSincecaptured;
    this.name = "CapturedPointInCooldownError";
  }
}
