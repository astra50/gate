<?php

declare(strict_types=1);

namespace App\Infrastructure\Centrifugo;

use App\Domain\User\UserId;

interface Centrifugo
{
    public function generateConnectionToken(
        UserId $userId,
        int $exp = 0,
        array $info = [],
        array $channels = []
    ): string;

    public function publish(string $channel, array $data): void;
}
