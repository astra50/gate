<?php

declare(strict_types=1);

namespace App\Infrastructure\Gate;

use App\Domain\Gate\Gate;
use App\Domain\Gate\OpenRequestId;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;

final class UiscomGate implements Gate
{
    private const GATE_PHONE = '79255692227';
    private const VIRTUAL_NUMBER = '74959848182';

    private HttpClientInterface $httpClient;

    private ?string $token;

    public function __construct(HttpClientInterface $httpClient, string $token = null)
    {
        $this->httpClient = $httpClient;
        $this->token = $token;
    }

    /**
     * @throws Throwable
     */
    public function open(OpenRequestId $requestId): void
    {
        $this->httpClient->request('POST', '', [
            'timeout' => 2.5,
            'json' => [
                'jsonrpc' => '2.0',
                'id' => $requestId->toString(),
                'method' => 'start.informer_call',
                'params' => [
                    'access_token' => $this->token,
                    'contact' => self::GATE_PHONE,
                    'virtual_phone_number' => self::VIRTUAL_NUMBER,
                    'external_id' => $requestId->toString(),
                    'contact_message' => [
                        'type' => 'tts',
                        'value' => 'Открывай ворота!',
                    ],
                ],
            ],
        ])->toArray();
    }
}
