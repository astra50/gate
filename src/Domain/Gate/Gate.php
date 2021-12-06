<?php

declare(strict_types=1);

namespace App\Domain\Gate;

use App\Domain\User\UserId;
use Throwable;

interface Gate
{
    /**
     * @throws Throwable
     */
    public function open(OpenRequestId $requestId, UserId $userId): void;
}
