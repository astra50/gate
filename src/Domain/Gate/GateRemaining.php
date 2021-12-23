<?php

declare(strict_types=1);

namespace App\Domain\Gate;

use Ramsey\Uuid\UuidInterface;

interface GateRemaining
{
    public function getRemainingTime(UuidInterface $gateId): int;
}
