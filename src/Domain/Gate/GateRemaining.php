<?php

declare(strict_types=1);

namespace App\Domain\Gate;

interface GateRemaining
{
    public function getRemainingTime(): int;
}
